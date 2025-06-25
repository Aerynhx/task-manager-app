//The styles are designed to create an iOS inspired interface and proper spacing that looks great on any device and color theme
 
  
  //pill shaped buttons and containers and color palette matching ios design
  // consistent spacing using multiples of 8px
  // subtle shadows and transparency effects
  // responsive design 
 

import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // main container that holds everything
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60, 
    paddingHorizontal: 16,
  },
  
  // base styling for sections 
  iosSection: {
    shadowColor: 'transparent',    
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,                  
  },
  
  // search bar 
  iosSearchBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 17,                   // iOS standard font size for input fields
  },
  
 
  segmentedSection: {},
  
  // container for the filter buttons at the top
  segmentedControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // individual filter button styling
  segmentedControlButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  
  // text inside the filter buttons 
  segmentedControlText: {
    fontSize: 15,
    fontWeight: '500',              // medium weight for good readability
  },
  
  //  add new tasks section
  iosAddSection: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,                        
  },
  
  // standard ios input field
  iosInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 17,                  
  },
  
  // the main task list area
  iosTaskListSection: {
    flex: 1,
    minHeight: 120,                
  },
  
  // individual task item styling 
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'transparent',     
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  // the circular checkbox icon
  iosCheckbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // task completion
  iosCheckboxInner: {
    width: 14,
    height: 14,
  },
  
  // main task text
  taskText: {
    fontSize: 17,
    fontWeight: '500',
  },
  
  // strikethrough task when completed
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  
 
  dateText: {
    fontSize: 13,
    marginTop: 2,
  },
  
  // delete button
  deleteButton: {
    padding: 4,
  },
  
  // delete button style
  deleteText: {
    fontSize: 22,
    fontWeight: '600',
  },
  
  // text shown when no tasks added yet
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  
  // consistent spacing
  sectionSpacing: {
    marginBottom: 18,
  },
  
  
  pillSection: {
    borderRadius: 24,              
  },
  
  pillInput: {
    borderRadius: 24,
  },
  
  pillCheckbox: {
    borderRadius: 24,
  },
  
  pillPadding: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  
  // modal overlay for the date picker
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // confirmation button in the date picker modal
  checkButton: {
    marginTop: 16,
    backgroundColor: '#3B82F7',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  //  separator line between tasks
  taskSeparator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 4,
    marginLeft: 44,                
  },
  

  compactPadding: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  
  // start & end buttons
  compactDateButton: {
    borderRadius: 999,              
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  
 
  compactDateText: {
    fontSize: 15,
    fontWeight: '600',
  },
  

  addButtonCompact: {
    borderRadius: 14,
    width: 28,
    height: 28,
    backgroundColor: '#3B82F7',     
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
}); 