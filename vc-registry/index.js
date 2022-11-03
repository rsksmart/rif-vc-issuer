import express  from 'express'
import * as IPFS from 'ipfs-core'
const app = express()
const port = 3001

app.use(express.json())

const node = await IPFS.create()

app.get('/:cid', async(req, res) => {
    if (!req.params) {
        throw new Error('empty cid');
    }
    console.log("🚀 ~ file: index.js ~ line 11 ~ app.get ~ req.body", req.params)
    const content = await node.cat(req.params.cid);
    const decoder = new TextDecoder()
    let data = ''
    
    for await (const chunk of content) {
      // chunks of data are returned as a Uint8Array, convert it back to a string
      data += decoder.decode(chunk, { stream: true })
    }

    res.send({
        data
    })
})

app.post('/', async(req, res) => {
    if (!req.body) {
        throw new Error('empty body');
    }
    console.log("🚀 ~ file: index.js ~ line 11 ~ app.get ~ req.body", req.body)
    const { cid, path } = await node.add(JSON.stringify(req.body))
    res.send({
        cid: cid.toString(),
        path
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})