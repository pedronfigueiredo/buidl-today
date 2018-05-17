#!/bin/bash

# paste on .zshrc or .bashrc
# alias btd="cd ~/src/buidl-today && clear && pwd && prod && git status"

SESSION_NAME="BuidlToday"

cd ~/Documents/src/buidl-today-node-redux

tmux has-session -t ${SESSION_NAME}

if [ $? != 0 ]
then
  tmux new-session -d -s ${SESSION_NAME}

  tmux new-window -t ${SESSION_NAME}:1 -n 'Editor'
  tmux send-keys -t ${SESSION_NAME}:1 "vi" C-m
  
  tmux new-window -t ${SESSION_NAME}:2 -n 'Truffle, npm and git'
  tmux split-window -h -t ${SESSION_NAME}
  tmux split-window -v -t ${SESSION_NAME}
  tmux select-pane -L
  tmux split-window -v -t ${SESSION_NAME}
  # Upper left
  tmux select-pane -t 0
  tmux send-keys -t ${SESSION_NAME}:2 "truffle develop" C-m
  # Lower left
  tmux select-pane -t 1
  tmux send-keys -t ${SESSION_NAME}:2 "clear && git status" C-m
  # Upper right
  tmux select-pane -t 2
  tmux send-keys -t ${SESSION_NAME}:2 "npm run dev" C-m
  # Lower right
  tmux select-pane -t 3
  tmux send-keys -t ${SESSION_NAME}:2 "cd ../buidl-api && clear && git status" C-m
  # Select Truffle pane
  tmux select-pane -t 0
  

  tmux new-window -t ${SESSION_NAME}:3 -n 'Truffle, npm and git'
  tmux split-window -h -t ${SESSION_NAME}
  # Left - Mongo daemon
  tmux select-pane -t 0
  tmux send-keys -t ${SESSION_NAME}:3 "mongod" C-m
  # Right - Mongo console
  tmux select-pane -t 1
  tmux send-keys -t ${SESSION_NAME}:3 "mongo" C-m

  # Select Trufle, npm and git window
  tmux select-window -t 2

fi
tmux attach -t ${SESSION_NAME}
