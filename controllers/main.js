const getTableData = (req, res, db) => {
  db.select('*').from('Players')
    .then(items => {
      if(items.length){
        res.json(items)
      } else {
        res.json({dataExists: 'GET returned nothing false'})
      }
    })
    .catch(err => res.status(400).json({dbError: 'get db error'}))
}

const postTableData = (req, res, db) => {
  // const { table, role_name, alignment } = req.body
  const { table, username } = req.body
  // console.log('what is req body', req.body)
  // console.log('what is name', name)
  // const added = new Date()

  // console.log(table, role_name, alignment)
  db(table).insert({username})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: err}))
}

const putTableData = (req, res, db) => {
  const { id, first, last, email, phone, location, hobby } = req.body
  db('testtable1').where({id}).update({first, last, email, phone, location, hobby})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

const deleteTableData = (req, res, db) => {
  const { id } = req.body
  db('testtable1').where({id}).del()
    .then(() => {
      res.json({delete: 'true'})
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}

module.exports = {
  getTableData,
  postTableData,
  putTableData,
  deleteTableData
}
