const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port =process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dflzr3e.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
await client.connect()
const toolCollection=client.db('electricalSpark').collection('tools')
const purchaseCollection=client.db('electricalSpark').collection('purchases')
const userCollection=client.db('electricalSpark').collection('users')


app.get('/tool',async(req,res)=>{
    const query={}
    const cursor=toolCollection.find(query)
    const tools=await cursor.toArray()
    res.send(tools)
})

app.put('/user/:email',async(req,res)=>{
    const email=req.params.email
    const user=req.body
    const filter={email:email}
    const options = { upsert: true };
    const updateDoc = {
        $set: user,
      };
      const result=await userCollection.updateOne(filter,updateDoc,options)
      res.send(result)
})

app.get('/ordered',async (req,res)=>{
   const tools=await purchaseCollection.find().toArray()
    res.send(tools)

})

app.get('/purchase',async(req,res)=>{
 const customer=req.query.customer
 const query={customer:customer}
 const purchases=await purchaseCollection.find(query).toArray()
 res.send(purchases)
})

app.post('/purchase',async(req,res)=>{
    const purchase=req.body
    const result=await purchaseCollection.insertOne(purchase)
    res.send(result)
})

}
finally{

}
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello ELECTRICAL SPARK')
})

app.listen(port, () => {
  console.log(`Electrical spark app listening on port ${port}`)
})