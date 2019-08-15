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

const getTableDataOld = (req, res, db) => {
  db.select('*').from('testtable1')
    .then(items => {
      if(items.length){
        res.json(items)
      } else {
        res.json({dataExists: 'false'})
      }
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
}


const postTableData = (req, res, db) => {
  const { name } = req.body
  console.log('what is req body', req.body)
  console.log('what is name', name)
  const added = new Date()
  db('testplayers').insert({name})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'post to table error'}))
}
const postTableDataOld = (req, res, db) => {
  const { first, last, email, phone, location, hobby } = req.body
  const added = new Date()
  db('testtable1').insert({first, last, email, phone, location, hobby, added})
    .returning('*')
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error'}))
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
