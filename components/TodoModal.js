import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, KeyboardAvoidingView, TextInput, Keyboard, Animated, Alert, Modal } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from '../Colors';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import { lightTheme, darkTheme } from '../theme';

export class TodoModal extends React.Component {
    state = {
        newTodo: "",
        showDeleteAlert: false
    };

    toggleTodoCompleted = index => {
        let list = this.props.list;
        list.todos[index].completed = !list.todos[index].completed;

        this.props.updateList(list);
    };

    addTodo = () => {
        let list = this.props.list;
        const newTodoText = this.state.newTodo.trim();

        if (newTodoText && !list.todos.some(todo => todo.title === newTodoText)) {
            list.todos.push({title: newTodoText, completed: false});
            this.props.updateList(list);
        }

        this.setState({newTodo: ""});
        Keyboard.dismiss();
    };

    handleKeyPress = (event) => {
        if (event.nativeEvent.key === 'Enter') {
            this.addTodo();
        }
    };

    deleteTodo = index => {
        let list = this.props.list;
        list.todos.splice(index, 1);

        this.props.updateList(list);
    }

    handleDeleteList = () => {
        this.setState({ showDeleteAlert: true });
    };

    renderTodo = (todo, index) => {
        const theme = this.props.isDarkMode ? darkTheme : lightTheme;
        return (
            <Swipeable renderRightActions={(_, dragX) => this.rightActions(dragX, index)}>
                <View style={[styles.todoContainer, { backgroundColor: theme.modalBackground }]}>
                    <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                        <Ionicons 
                            name={todo.completed ? "square" : "square-outline"} 
                            size={24} 
                            color={theme.text} 
                            style={{width: 32}}
                        />
                    </TouchableOpacity>

                    <Text 
                        style={[
                            styles.todo, 
                            {
                                textDecorationLine: todo.completed ? "line-through" : "none", 
                                color: todo.completed ? colors.gray : theme.text,
                                flexWrap: 'wrap',
                                maxWidth: '80%',
                            }
                        ]}
                    >
                        {todo.title}
                    </Text>
                </View>
            </Swipeable>
        );
    };

    rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: "clamp"
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: "clamp"
        })

        return (
            <TouchableOpacity onPress={() => this.deleteTodo(index)}>
                <Animated.View style={[styles.swipeDeleteButton, {opacity: opacity}]}>
                    <Animated.Text style={{color: colors.white, fontWeight: "800", transform: [{scale}]}}>
                        Удалить
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        )
    }

    render() {
        const list = this.props.list;
        const theme = this.props.isDarkMode ? darkTheme : lightTheme;

        const taskCount = list.todos.length;
        const completedCount = list.todos.filter(todo => todo.completed).length;
        
        return (
            <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                <GestureHandlerRootView style={{flex: 1}}>
                    <SafeAreaView style={[styles.container, { backgroundColor: theme.modalBackground }]}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.showDeleteAlert}
                            onRequestClose={() => this.setState({ showDeleteAlert: false })}
                        >
                            <View style={styles.alertContainer}>
                                <View style={[styles.alertBox, { backgroundColor: theme.modalBackground }]}>
                                    <View style={styles.alertHeader}>
                                        <AntDesign name="delete" size={24} color={colors.red} />
                                        <Text style={[styles.alertTitle, { color: theme.text }]}>Удалить лист</Text>
                                    </View>
                                    <Text style={[styles.alertMessage, { color: theme.text }]}>
                                        Вы уверены, что хотите удалить этот лист?
                                    </Text>
                                    <View style={styles.alertButtons}>
                                        <TouchableOpacity 
                                            style={[styles.alertButton, styles.cancelButton]}
                                            onPress={() => this.setState({ showDeleteAlert: false })}
                                        >
                                            <Text style={styles.cancelButtonText}>Назад</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.alertButton, styles.deleteButton]}
                                            onPress={() => {
                                                this.props.deleteList(this.props.list.id);
                                                this.props.closeModal();
                                            }}
                                        >
                                            <Text style={styles.deleteButtonText}>Удалить</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <TouchableOpacity 
                            style={{position: "absolute", top: 64, right: 32, zIndex: 10}} 
                            onPress={this.props.closeModal}
                        >
                            <AntDesign name="close" size={24} color={theme.text} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={{position: "absolute", top: 64, left: 32, zIndex: 10}} 
                            onPress={this.handleDeleteList}
                        >
                            <AntDesign name="delete" size={24} color={colors.red} />
                        </TouchableOpacity>

                        <View style={[styles.section, styles.header, {borderBottomColor: list.color}]}>
                            <View>
                                <Text style={[styles.title, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
                                    {list.name.length > 15 ? list.name.substring(0, 15) + "..." : list.name}
                                </Text>
                                <Text style={[styles.taskCount, { color: theme.text }]}>
                                    {completedCount} of {taskCount} задач
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.section, {flex: 3, marginVertical: 16}]}>
                            <FlatList 
                                data={list.todos}
                                renderItem={({item, index}) => this.renderTodo(item, index)}
                                keyExtractor={(item => item.title)}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>

                        <View style={[styles.section, styles.footer]}>
                            <TextInput 
                                style={[
                                    styles.input, 
                                    {
                                        borderColor: list.color,
                                        color: theme.text,
                                        backgroundColor: theme.modalBackground
                                    }
                                ]} 
                                onChangeText={text => this.setState({newTodo: text})} 
                                value={this.state.newTodo}
                                placeholderTextColor={theme.text}
                                placeholder="Добавьте задачу "
                                onKeyPress={this.handleKeyPress}
                            />
                            <TouchableOpacity 
                                style={[styles.addTodo, {backgroundColor: list.color}]} 
                                onPress={() => this.addTodo()}
                            >
                                <AntDesign name="plus" size={16} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </GestureHandlerRootView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    section: {
        alignSelf: "stretch"
    },
    header: {
        justifyContent: "flex-end",
        marginLeft: 64,
        borderBottomWidth: 3,
        paddingTop: 16
    },
    title: {
        fontSize: 30,
        fontWeight: "800",
        color: colors.black,
        
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: "600"
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 32
    },
    todo: {
        color: colors.black,
        fontWeight: "700",
        fontSize: 16
    },
    swipeDeleteButton: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: "center",
        alignItems: "center",
        width: 80
    },
    alertContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertBox: {
        width: '80%',
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10
    },
    alertMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    alertButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10
    },
    alertButton: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center'
    },
    cancelButton: {
        backgroundColor: colors.lightGray
    },
    deleteButton: {
        backgroundColor: colors.red
    },
    cancelButtonText: {
        color: colors.black,
        fontSize: 16,
        fontWeight: '600'
    },
    deleteButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600'
    }
});