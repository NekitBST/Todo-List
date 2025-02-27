import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from './Colors';
import TodoList from './components/TodoList';
import AddListModal from './components/AddListModel';
import Fire from './Fire';
import { lightTheme, darkTheme } from './theme';

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true,
    isDarkMode: false,
    isListView: false
  };

  componentDidMount() {
    this.fire = new Fire((error, user) => {
      if (error) {
        return alert("Ой, ой, что-то пошло не так");
      }

      this.setState({ user });

      this.fire.getLists((lists) => {
        this.setState({ lists, loading: false });
      });
    });
  }

  componentWillUnmount() {
    this.fire.detach();
  }

  toggleAddTodoModal() {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  }

  toggleTheme = () => {
    this.setState(prevState => ({
      isDarkMode: !prevState.isDarkMode
    }));
  };

  toggleViewMode = () => {
    this.setState(prevState => ({
      isListView: !prevState.isListView
    }));
  };

  deleteList = listId => {
    this.fire.deleteList(listId);
  };

  renderList = list => {
    return (
      <TodoList 
        list={list} 
        updateList={this.updateList}
        deleteList={this.deleteList}
        isDarkMode={this.state.isDarkMode}
        isListView={this.state.isListView}
      />
    );
  };

  addList = list => {
    this.fire.addList({
        name: list.name,
        color: list.color,
        todos: []
    });
};

  updateList = list => {
    this.fire.updateList(list);
  };

  render() {
    const theme = this.state.isDarkMode ? darkTheme : lightTheme;

    if (this.state.loading) {
      return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.themeToggle} 
              onPress={this.toggleTheme}
            >
              <Ionicons 
                name={this.state.isDarkMode ? "sunny" : "moon"} 
                size={24} 
                color={theme.text} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.viewToggle} 
              onPress={this.toggleViewMode}
            >
              <Ionicons 
                name={this.state.isListView ? "grid" : "list"} 
                size={24} 
                color={theme.text} 
              />
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            visible={this.state.addTodoVisible}
            onRequestClose={() => this.toggleAddTodoModal()}
          >
            <AddListModal 
              closeModal={() => this.toggleAddTodoModal()} 
              addList={this.addList}
              isDarkMode={this.state.isDarkMode} 
            />
          </Modal>

          <View style={styles.header}>
            <View style={{flexDirection: "row"}}>
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
              <Text style={[styles.title, { color: theme.text }]}>
                Todo <Text style={{fontWeight: "300", color: colors.blue}}>List</Text>
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
            </View>

            <View style={{marginVertical: 48}}>
              <TouchableOpacity style={styles.addList} onPress={() => this.toggleAddTodoModal()}>
                <AntDesign name="plus" size={16} color={colors.blue} />
              </TouchableOpacity>

              <Text style={styles.add}>Add List</Text>
            </View>
          </View>

          <View style={[
            styles.listContainer,
            this.state.isListView && styles.listViewContainer
          ]}>
            <FlatList
              data={this.state.lists}
              keyExtractor={item => item.id.toString()}
              horizontal={!this.state.isListView}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => this.renderList(item)}
              keyboardShouldPersistTaps="always"
              style={this.state.isListView ? styles.verticalList : null}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  },
  headerButtons: {
    position: 'absolute',
    top: 64,
    right: 32,
    flexDirection: 'row',
    zIndex: 10
  },
  themeToggle: {
    marginRight: 20
  },
  viewToggle: {
  },
  header: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 120
  },
  listContainer: {
    height: 275,
    paddingLeft: 0,
    paddingRight: 0
  },
  listViewContainer: {
    flex: 1,
    height: undefined, 
    marginTop: 20
  },
  verticalList: {
    width: '100%'
  }
});
