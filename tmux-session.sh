#!/bin/bash

# paste on .zshrc or .bashrc
# alias btd="cd ~/src/buidl-today && clear && pwd && prod && git status"

SESSION_NAME="BuidlToday"

tmux has-session -t ${SESSION_NAME}

if [ $? != 0 ]
then
  tmux new-session -d -s ${SESSION_NAME}
  tmux new-window -t ${SESSION_NAME}:1 -n 'Buidl.Today Dashboard'
  tmux split-window -h -t ${SESSION_NAME}
  tmux split-window -v -t ${SESSION_NAME}
  tmux select-pane -L
  tmux split-window -v -t ${SESSION_NAME}
  
  # Upper left
  tmux select-pane -t 0
  tmux send-keys -t ${SESSION_NAME}:1 "btd  && truffle develop" C-m

  # Lower left
  tmux select-pane -t 1
  tmux send-keys -t ${SESSION_NAME}:1 "btd" C-m

  # Upper right
  tmux select-pane -t 2
  tmux send-keys -t ${SESSION_NAME}:1 "btd && npm run start" C-m

  # Lower right
  tmux select-pane -t 3
  tmux send-keys -t ${SESSION_NAME}:1 "btd && npm run test" C-m
  
  # Select Truffle pane
  tmux select-pane -t 0

  tmux new-window -t ${SESSION_NAME}:2 -n 'Editor'
  tmux send-keys -t ${SESSION_NAME}:2 "btd && vi" C-m
fi
tmux attach -t ${SESSION_NAME}
