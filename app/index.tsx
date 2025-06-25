
//The Task manager main screen. It handles everything from adding new tasks to filtering and searching through existing ones. 
//the interface is designed with ios aesthetics in mind


// imports for building the UI and managing app state
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, FlexAlignType, Keyboard, Modal, Platform, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { styles } from '../styles';

// task definition, ID / title / description / start / finish dates for each task / completed or not
interface Task {
  id: string;          
  title: string;       
  description: string; 
  completed: boolean;  
  startTime: Date;     
  endTime: Date;       
}

// different ways tasks can be filtered
type FilterType = 'all' | 'completed' | 'not_completed';


 // smart & friendly date formatting instead of wonky date and time formats
  
 
const formatSmartDateTime = (date: Date): string => {
  // get current date info for comparison
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // calculate how many days difference between today and the task date
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return timeString; 
  } else if (diffDays === 1) {
    return `Tmrw ${timeString}`; 
  } else if (diffDays === -1) {
    return `Yesterday ${timeString}`;
  } else if (diffDays > 1 && diffDays <= 7) {
    return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${timeString}`;
  } else {
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeString}`;
  }
};

export default function HomeScreen() {
  // All the state variables that keep track of what's happening in the app
  const [tasks, setTasks] = useState<Task[]>([]);                    //  main list of tasks
  const [title, setTitle] = useState('');                           //  what's being typed for the task title
  const [description, setDescription] = useState('');               // optional task description
  const [startTime, setStartTime] = useState<Date>(() => new Date()); // when the task should start - defaults to today
  const [endTime, setEndTime] = useState<Date>(() => new Date());   // when the task should end - defaults to today
  const [showStartPicker, setShowStartPicker] = useState(false);    
  const [showEndPicker, setShowEndPicker] = useState(false);      
  const [search, setSearch] = useState('');                         // search input
  const [filter, setFilter] = useState<FilterType>('all');          // which tasks to show (all/completed/not completed)
  const [tempDate, setTempDate] = useState<Date>(new Date());       // temp date placeholder while user is picking
  const [pickerType, setPickerType] = useState<'start' | 'end' | null>(null); // which picker is open
  
  // android-specific state for handling date/time picking in steps
  const [androidPickerMode, setAndroidPickerMode] = useState<'date' | 'time' | null>(null);
  
  // get the current theme (light or dark) and set up colors accordingly
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = {
    ...Colors[colorScheme],
    background: colorScheme === 'dark' ? '#000' : '#F2F2F7',    // ios style background colors
    card: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',       // card backgrounds
    input: colorScheme === 'dark' ? '#1C1C1E' : '#E3E3E8',      // input field colors
  };

  // styling the date picker modal
  const modalContent: ViewStyle = {
    backgroundColor: themeColors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center' as FlexAlignType,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  
    //add a new task to the list only adds if there's actually a title, then sorts the list by start time
   
  const addTask = () => {
    if (title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),        
        title: title.trim(),             
        description: description.trim(),   
        completed: false,                 
        startTime,
        endTime,
      };
      // add the new task and sort the entire list by start time
      setTasks(prev =>
        [...prev, newTask].sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      );
      // clear the form for the next task 
      setTitle('');
      setDescription('');
      const today = new Date();
      setStartTime(today);
      setEndTime(today);
      Keyboard.dismiss(); 
    }
  };

  // toggle a task between completed and not completed

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // remove a task from the list completely

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // for android, handle date/time picker in two steps first pick date, then pick time

  const handleAndroidDateTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (androidPickerMode === 'date') {
        // picked a date, now show time picker
        setTempDate(selectedDate);
        setAndroidPickerMode('time');
      } else if (androidPickerMode === 'time') {
        // picked a time, combine with the date and finish
        const finalDate = new Date(tempDate);
        finalDate.setHours(selectedDate.getHours());
        finalDate.setMinutes(selectedDate.getMinutes());
        
        // update the appropriate time based on which picker was opened
        if (pickerType === 'start') setStartTime(finalDate);
        if (pickerType === 'end') setEndTime(finalDate);
        
        setShowStartPicker(false);
        setShowEndPicker(false);
        setPickerType(null);
        setAndroidPickerMode(null);
      }
    } else {
      setShowStartPicker(false);
      setShowEndPicker(false);
      setPickerType(null);
      setAndroidPickerMode(null);
    }
  };

  // for ios, handle date/time picker

  const handleIOSDateTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      // check if the task matches the search query
      const searchText = search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchText);
      const descriptionMatch = task.description.toLowerCase().includes(searchText);
      const searchMatch = titleMatch || descriptionMatch;
      
      // apply both search and filter criteria
      return searchMatch &&
        (filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'not_completed' && !task.completed));
    })
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {}
      <ThemedView style={[styles.iosSection, styles.segmentedSection, styles.sectionSpacing, { backgroundColor: themeColors.background }]}>
        <View style={styles.segmentedControlContainer}>
          {['all', 'completed', 'not_completed'].map((key, idx) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.segmentedControlButton,
                { borderColor: themeColors.background },
                filter === key && { backgroundColor: themeColors.input, borderColor: themeColors.secondaryText },
                idx === 0 && { borderTopLeftRadius: 999, borderBottomLeftRadius: 999 },
                idx === 2 && { borderTopRightRadius: 999, borderBottomRightRadius: 999 },
              ]}
              onPress={() => setFilter(key as FilterType)}
              activeOpacity={0.8}
            >
              <ThemedText style={[
                styles.segmentedControlText,
                { color: themeColors.secondaryText },
                filter === key && { color: themeColors.mainText },
              ]}>
                {key === 'all' ? 'All' : key === 'completed' ? 'Completed' : 'Not Completed'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>
      
      {}
      <ThemedView style={[styles.iosSection, styles.sectionSpacing, styles.pillSection, { backgroundColor: themeColors.input, flexDirection: 'row', alignItems: 'center' }]}>
        <IconSymbol
          name="magnifyingglass"
          size={20}
          color={themeColors.secondaryText}
          style={{ marginLeft: 14, marginRight: 8 }}
        />
        <TextInput
          style={[styles.iosSearchBar, styles.pillInput, styles.pillPadding, { backgroundColor: themeColors.input, color: themeColors.mainText, flex: 1, paddingLeft: 0 }]}
          placeholder="Search"
          placeholderTextColor={themeColors.secondaryText}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </ThemedView>
      
      {}
      <ThemedView style={[styles.iosSection, styles.iosAddSection, styles.pillSection, styles.sectionSpacing, { backgroundColor: themeColors.card, flexDirection: 'column', alignItems: 'stretch', gap: 6, padding: 16 }]}>
        {}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <IconSymbol
              name="calendar"
              size={18}
              color={themeColors.secondaryText}
              style={{ marginLeft: 12, marginRight: 8 }}
            />
            <TextInput
              style={[styles.iosInput, styles.pillInput, styles.compactPadding, { backgroundColor: themeColors.card, color: themeColors.mainText, flex: 1, paddingLeft: 0 }]}
              placeholder="Title"
              placeholderTextColor={themeColors.secondaryText}
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
            />
          </View>
          {}
          <TouchableOpacity style={[styles.addButtonCompact, { marginRight: 12 }]} onPress={addTask} accessibilityLabel="Add task">
            <IconSymbol name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.iosInput, styles.pillInput, styles.compactPadding, { backgroundColor: themeColors.card, color: themeColors.mainText, flex: 1, paddingLeft: 32, marginLeft: 12, marginRight: 12 }]}
            placeholder="Description"
            placeholderTextColor={themeColors.secondaryText}
            value={description}
            onChangeText={setDescription}
            returnKeyType="done"
          />
        </View>
        
        {}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4, marginHorizontal: 12, marginBottom: 12 }}>
          <TouchableOpacity
            style={[styles.compactDateButton, { backgroundColor: '#3B82F7', flex: 1 }]}
            onPress={() => { 
              setPickerType('start'); 
              setTempDate(startTime); 
              if (Platform.OS === 'android') {
                setAndroidPickerMode('date');
              }
              setShowStartPicker(true); 
            }}
            accessibilityLabel="Pick start time"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <IconSymbol name="clock" size={18} color="#fff" />
              <ThemedText style={[styles.compactDateText, { color: '#fff' }]}>
                {formatSmartDateTime(startTime)}
              </ThemedText>
            </View>
          </TouchableOpacity>
          <ThemedText style={{ color: themeColors.secondaryText, fontSize: 12, fontWeight: '500', minWidth: 20, textAlign: 'center' }}>to</ThemedText>
          <TouchableOpacity
            style={[styles.compactDateButton, { backgroundColor: '#EB5545', flex: 1 }]}
            onPress={() => { 
              setPickerType('end'); 
              setTempDate(endTime); 
              if (Platform.OS === 'android') {
                setAndroidPickerMode('date');
              }
              setShowEndPicker(true); 
            }}
            accessibilityLabel="Pick end time"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <IconSymbol name="clock" size={18} color="#fff" />
              <ThemedText style={[styles.compactDateText, { color: '#fff' }]}>
                {formatSmartDateTime(endTime)}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showStartPicker || showEndPicker}
          transparent
          animationType="fade"
          onRequestClose={() => { setShowStartPicker(false); setShowEndPicker(false); setPickerType(null); }}
        >
          <View style={styles.modalOverlay}>
            <View style={modalContent}>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="inline"
                minimumDate={new Date()} // prevent selecting dates before today
                onChange={handleIOSDateTimeChange}
                style={{ backgroundColor: themeColors.card, borderRadius: 16 }}
              />
              {}
              <TouchableOpacity
                style={[styles.checkButton, { backgroundColor: '#3B82F7' }]}
                onPress={() => {
                  // update the appropriate time based on which picker was opened
                  if (pickerType === 'start') setStartTime(tempDate);
                  if (pickerType === 'end') setEndTime(tempDate);
                  // close the modal
                  setShowStartPicker(false);
                  setShowEndPicker(false);
                  setPickerType(null);
                }}
                accessibilityLabel="Confirm date and time"
              >
                <IconSymbol name="checkmark" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        // android date time picker
        (showStartPicker || showEndPicker) && androidPickerMode && (
          <DateTimePicker
            value={androidPickerMode === 'date' ? tempDate : new Date()}
            mode={androidPickerMode}
            display="default"
            minimumDate={androidPickerMode === 'date' ? new Date() : undefined}
            onChange={handleAndroidDateTimeChange}
          />
        )
      )}

      {}
      <ThemedView style={[styles.iosSection, styles.iosTaskListSection, { backgroundColor: themeColors.background }]}>
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <>
              {}
              <ThemedView style={[styles.taskCard, { backgroundColor: themeColors.background }]}>
                <View style={{ paddingHorizontal: 16, paddingVertical: 12, width: '100%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      {}
                      <TouchableOpacity
                        style={[
                          styles.iosCheckbox,
                          styles.pillCheckbox,
                          { borderColor: themeColors.secondaryText, backgroundColor: themeColors.background },
                          item.completed && { borderColor: themeColors.mainText, backgroundColor: themeColors.background },
                        ]}
                        onPress={() => toggleTask(item.id)}
                        accessibilityLabel={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {}
                        {item.completed && <View style={[styles.iosCheckboxInner, { backgroundColor: themeColors.secondaryText, borderRadius: 999 }]} />}
                      </TouchableOpacity>
                      {}
                      <ThemedText
                        style={[styles.taskText, { color: themeColors.mainText, marginLeft: 12, flexShrink: 1 }, item.completed && styles.taskTextCompleted]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </ThemedText>
                    </View>
                    {}
                    <TouchableOpacity
                      style={[styles.deleteButton, { marginLeft: 8 }]}
                      onPress={() => deleteTask(item.id)}
                      accessibilityLabel="Delete task"
                    >
                      <ThemedText style={[styles.deleteText, { color: themeColors.secondaryText }]}>✕</ThemedText>
                    </TouchableOpacity>
                  </View>
                  {}
                  {item.description.trim() && (
                    <ThemedText style={[styles.dateText, { color: themeColors.secondaryText, marginLeft: 44, marginTop: 2 }]}> 
                      {item.description}
                    </ThemedText>
                  )}
                      {}
                  <ThemedText style={[styles.dateText, { color: themeColors.secondaryText, marginLeft: 44 }]}> 
                    {item.startTime.toLocaleDateString()} {item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {item.endTime.toLocaleDateString()} {item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </ThemedText>
                </View>
              </ThemedView>
              {}
              <View style={styles.taskSeparator} />
            </>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          // message when no tasks match the current filter/search
          ListEmptyComponent={<ThemedText style={[styles.emptyText, { color: themeColors.secondaryText }]}>Add tasks to get started.</ThemedText>}
          keyboardShouldPersistTaps="handled"
        />
      </ThemedView>
    </ThemedView>
  );
} 