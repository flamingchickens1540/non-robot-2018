var scout = require("scouting")
scout.init('match',true)
scout.page("Login", [12])
scout.login(".login")
scout.page("Match", [4,4,4])
scout.timer(".cell-match-2",".cell-match-2","Start",30,150)
scout.radio(
  ".cell-match-1",
  "Left Switch",
  [
    {
      text: 'Red',
      color: 'danger'
    },
    {
      text: 'Neither',
      color: 'dark'
    },
    {
      text: 'Blue',
      color: 'primary'
    }
  ],
  "leftswitch",
  false,
  undefined,
  true
);
scout.radio(
  ".cell-match-2",
  "Scale",
  [
    {
      text: 'Red',
      color: 'danger'
    },
    {
      text: 'Neither',
      color: 'dark'
    },
    {
      text: 'Blue',
      color: 'primary'
    }
  ],
  'scale',
  false,
  undefined,
  true
);
scout.radio(
  ".cell-match-3",
  "Right Switch",
  [
    {
      text: 'Red',
      color: 'danger'
    },
    {
      text: 'Neither',
      color: 'dark'
    },
    {
      text: 'Blue',
      color: 'primary'
    }
  ],
  'rightswitch',
  false,
  undefined,
  true
);
scout.bluetooth();
scout.done(".cell-match-1",true);
