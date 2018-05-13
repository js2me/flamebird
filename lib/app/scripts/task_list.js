/* global $,  _ , createButton, global, Keyboard, createSpan */

window.TaskList = (function() {// eslint-disable-line
  var element
  var taskList = {
    npm: [],
    procfile: [],
  }
  var activeTab
  var activeTask = {
    npm: null,
    procfile: null,
  }

  function updateTaskList() {
    taskList[activeTab].forEach(function(taskData, index) {
      var task = document.createElement('div')
      task.classList.add(
        'task',
        'task-num-' + (index + 1),
        taskData.isRun && 'running',
        taskData.isStartRunning && 'clicked'
      )
      task.setAttribute('id', taskData.name)
      task.setAttribute('onclick', "global.openTask('" + taskData.name + "')")
      if (window.Keyboard) {
        Keyboard.connect(task, index)
      }
      task.innerHTML =
        '<i class="fas fa-cog"></i>' +
        createSpan('task-name', taskData.name) +
        createButton(
          'run-task',
          'play',
          "global.runTask('" + taskData.name + "')"
        ) +
        createButton(
          'stop-task',
          'stop',
          "global.stopTask('" + taskData.name + "')"
        )
      element.appendChild(task)
    })
    setTimeout(function() {
      $('#' + activeTask[activeTab]).trigger('click')
    }, 0)
  }
  function changeTab(newTab) {
    document.getElementById(activeTab).classList.remove('active')
    activeTab = newTab
    document.getElementById(activeTab).classList.add('active')
    clear()
    updateTaskList()
  }
  function getTask(name) {
    return _.find(taskList[activeTab], function(c) {
      return c.name === name
    })
  }
  function updateTask(name, isRun, isActive, isStartRunning, isStopping) {
    var task = getTask(name)
    var taskButton = document.getElementById(name)
    console.log(name, task)
    task.isRun = isRun
    task.isStartRunning = !!isStartRunning
    task.isStopping = !!isStopping

    if (isActive) {
      task.isActive = true
      var previousActiveTask = document.querySelector('.task.active')
      if (previousActiveTask) {
        var id = previousActiveTask.getAttribute('id')
        if (id !== name) {
          getTask(previousActiveTask.getAttribute('id')).isActive = false
          previousActiveTask.classList.remove('active')
        }
      }
      taskButton.classList.add('active')
    }

    taskButton.classList[isStopping ? 'add' : 'remove']('stopping')
    taskButton.classList[isRun ? 'add' : 'remove']('running')
    taskButton.classList[isStartRunning ? 'add' : 'remove']('clicked')
    return task
  }

  function clear() {
    while (element.lastChild) {
      element.removeChild(element.lastChild)
    }
  }
  function setActive(task, isStartRunning, isStopping) {
    activeTask[task.isNPM ? 'npm' : 'procfile'] = task.name
    updateTask(
      task.name,
      task.isRun,
      true,
      isStartRunning === undefined ? task.isStartRunning : isStartRunning,
      isStopping === undefined ? task.isStopping : isStopping
    )
  }

  function getActive() {
    return getTask(activeTask[activeTab])
  }

  function getAllFromActiveTab(isRun) {
    return isRun
      ? _.filter(taskList[activeTab], function(task) {
          return task.isRun
        })
      : taskList[activeTab]
  }

  return function(el, tasks) {
    element = el
    taskList = _.reduce(
      tasks,
      function(newTaskList, task) {
        newTaskList[task.isNPM ? 'npm' : 'procfile'].push(task)
        return newTaskList
      },
      {
        npm: [],
        procfile: [],
      }
    )
    activeTask.npm = taskList.npm[0].name
    activeTask.procfile = taskList.procfile[0].name
    activeTab = taskList.procfile.length ? 'procfile' : 'npm'
    updateTaskList()
    return {
      updateTaskList: updateTaskList,
      clear: clear,
      changeTab: changeTab,
      getTask: getTask,
      updateTask: updateTask,
      setActive: setActive,
      getActive: getActive,
      getActiveTab: function() {
        return activeTab
      },
      getAllFromActiveTab: getAllFromActiveTab,
    }
  }
})()