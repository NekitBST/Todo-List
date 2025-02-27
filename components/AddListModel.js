import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../theme';

export default class AddListModal extends React.Component {
    backgroundColors = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"];
    
    state = {
        name: "",
        color: this.backgroundColors[0],
        showAlert: false
    };

    createTodo = () => {
        const {name, color} = this.state;

        if (!name.trim()) {
            this.setState({ showAlert: true });
            return;
        }

        const list = {name, color};
        this.props.addList(list);
        this.setState({name: ""});
        this.props.closeModal();
    };

    renderColors() {
        return this.backgroundColors.map(color => {
            return (
                <TouchableOpacity 
                    key={color} 
                    style={[styles.colorSelect, {backgroundColor: color}]} 
                    onPress={() => this.setState({color: color})} 
                />
            );
        });
    }

    render() {
        const theme = this.props.isDarkMode ? darkTheme : lightTheme;
        
        return (
            <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.modalBackground }]} behavior="padding">
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showAlert}
                    onRequestClose={() => this.setState({ showAlert: false })}
                >
                    <View style={styles.alertContainer}>
                        <View style={[styles.alertBox, { backgroundColor: theme.modalBackground }]}>
                            <View style={styles.alertHeader}>
                                <AntDesign name="warning" size={24} color={colors.red} />
                                <Text style={[styles.alertTitle, { color: theme.text }]}>Упсс...</Text>
                            </View>
                            <Text style={[styles.alertMessage, { color: theme.text }]}>
                                Введите имя листа!
                            </Text>
                            <TouchableOpacity 
                                style={[styles.alertButton, { backgroundColor: colors.blue }]}
                                onPress={() => this.setState({ showAlert: false })}
                            >
                                <Text style={styles.alertButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity style={{position: "absolute", top: 64, right: 32}} onPress={this.props.closeModal}>
                    <AntDesign name="close" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={{alignSelf: "stretch", marginHorizontal: 32}}>
                    <Text style={[styles.title, { color: theme.text }]}>Создать Todo List</Text>

                    <TextInput 
                        style={[styles.input, { 
                            borderColor: colors.blue,
                            color: theme.text,
                            backgroundColor: theme.modalBackground
                        }]} 
                        placeholder="Имя листа?"
                        placeholderTextColor={theme.text}
                        onChangeText={text => this.setState({name: text})} 
                    />

                    <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 12}}>
                        {this.renderColors()}
                    </View>

                    <TouchableOpacity 
                        style={[styles.create, {backgroundColor: this.state.color}]} 
                        onPress={this.createTodo}
                    >
                        <Text style={{color: colors.white, fontWeight: "600"}}>Create!</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.black,
    alignSelf: "center",
    marginBottom: 16
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.blue,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4
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
  alertButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.blue
  },
  alertButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600'
  }
});