import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import colors from '../Colors';
import {TodoModal} from './TodoModal';
import { lightTheme, darkTheme } from '../theme';

export default class TodoList extends React.Component {
    state = {
        showListVisible: false
    }

    toggleListModal() {
        this.setState({ showListVisible: !this.state.showListVisible });
    }

    render() {
        const list = this.props.list;
        const theme = this.props.isDarkMode ? darkTheme : lightTheme;
        const isListView = this.props.isListView;

        const completedCount = this.props.list.todos.filter(todo => todo.completed).length;
        const remainingCount = this.props.list.todos.length - completedCount;
        
        return (
            <View>
                <Modal 
                    animationType="slide" 
                    visible={this.state.showListVisible} 
                    onRequestClose={() => this.toggleListModal()}
                >
                    <TodoModal 
                        list={list} 
                        closeModal={() => this.toggleListModal()} 
                        updateList={this.props.updateList}
                        deleteList={this.props.deleteList}
                        isDarkMode={this.props.isDarkMode}
                    />
                </Modal>
                <TouchableOpacity 
                    style={[
                        styles.listContainer, 
                        { backgroundColor: this.props.list.color },
                        isListView ? styles.listViewContainer : null
                    ]} 
                    onPress={() => this.toggleListModal()}
                >
                    <Text style={[
                        styles.listTitle,
                        isListView ? styles.listViewTitle : null
                    ]} numberOfLines={1} ellipsizeMode="tail">
                        {isListView ? list.name : list.name.length > 12 ? list.name.substring(0, 12) + "..." : list.name}
                    </Text>
        
                    <View style={[
                        styles.countContainer,
                        isListView ? styles.listViewCountContainer : null
                    ]}>
                        <View style={{alignItems: isListView ? 'flex-start' : 'center'}}>
                            <Text style={styles.count}>{remainingCount}</Text>
                            <Text style={styles.subtitle}>Remaining</Text>
                        </View>
                        <View style={{alignItems: isListView ? 'flex-start' : 'center'}}>
                            <Text style={styles.count}>{completedCount}</Text>
                            <Text style={styles.subtitle}>Completed</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginHorizontal: 12,
        alignItems: "center",
        width: 200,
    },
    listTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.white,
        marginBottom: 18,
    },
    count: {
        fontSize: 48,
        fontWeight: "200",
        color: colors.white,
    },
    subtitle: { 
        fontSize: 12,
        fontWeight: "700",
        color: colors.white,
    },
    listViewContainer: {
        width: '90%',
        alignSelf: 'center',
        height: 100,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    listViewTitle: {
        fontSize: 20,
        marginBottom: 0,
        maxWidth: '50%'
    },
    listViewCountContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '40%',
        gap: 20
    },
    countContainer: {
        flexDirection: 'column'
    }
});
