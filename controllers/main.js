const moment = require('moment')


const avalonRoles = [
  {
    id: 1,
    role_name: "merlin",
  },
  {
    id: 2,
    role_name: "percival",
  },
  {
    id: 3,
    role_name: "servant",
  },
  {
    id: 4,
    role_name: "mordred",
  },
  {
    id: 5,
    role_name: "oberon",
  },
  {
    id: 6,
    role_name: "morgana",
  },
  {
    id: 7,
    role_name: "assassin",
  },
  {
    id: 8,
    role_name: "minion",
  }
]

const avalonRolesMap = {
  merlin: 1, percival: 2, servant: 3, mordred: 4, oberon: 5, morgana: 6, assassin: 7, minion: 8
}

const getTableData = (req, res, db) => {
  db.select('*').from('Roles')
    .then(items => {
      if(items.length){
        res.json(items)
      } else {
        res.json({dataExists: 'GET returned nothing false'})
      }
    })
    .catch(err => res.status(400).json({dbError: 'get db error'}))
}

const createNewGame = ({ body }, res, db) => {
/*
  {
    roles: {
      assassin: player1,
      merlin: player2,
      mordred: player3,
      servant: [player4, player5],
      minion: [player6, player7]
    },
    winningTeam: true/false, // true = good
    merlinassasstionation: true/false, // true = yes,
  }
*/
  // finish_date = currentDateTime, username, roleId
  const currentDateTime = JSON.stringify(moment());
  const rolesObject = body.roles;

  // [{username: player1, role_id: 1}, {username: player2, role_id: }]
  
  const parsedRoleArray = [];
  for (var key in rolesObject) {
    if (rolesObject[key] === null || key === 'count') {
    } else if (key === 'servant' || key === 'minion') {
      rolesObject[key].forEach(function (member) { 
        parsedRoleArray.push({username: member, role_id: avalonRolesMap[key]})
      })
    } else {
      parsedRoleArray.push({username: rolesObject[key], role_id: avalonRolesMap[key]})
    }
  }

  console.log('THIS IS WHAT IS THE PARSED ROLE ARRAY', parsedRoleArray)

  db.raw(`
    INSERT INTO Games (finish_date, winner, merlin_assassinated)
    VALUES (?, ?, ?)`,
    [currentDateTime, body.winningTeam, body.merlinAssassinated])
    .then(items => {})
    .catch(err => console.log('games error', err))

  parsedRoleArray.forEach(function(player) {
    db.raw(`INSERT INTO GamesPlayerMap (finish_date, username, role_id) VALUES (?, ?, ?)`, [currentDateTime, player.username, player.role_id])
    .then(items => {})
    .catch(err => console.log('gameplayermap error', err))
  })
}

const postTableData = (req, res, db) => {
  console.log('WHAT IS THE REQUEST', req.body)
  const { table, username } = req.body

  db(table).insert({username})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: err}))
}

module.exports = {
  getTableData,
  postTableData,
  createNewGame ,
}
