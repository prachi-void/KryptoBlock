var fileStore = artifacts.require("fileStore");
require('chai').use(require('chai-as-promised')).should()


contract('file',(accounts)=>{
    let file

    before(async()=>{
        file=await fileStore.deployed()
    })

    describe('deployment',async()=>{
        it('tested successfully',async()=>{
            file=await fileStore.deployed()
        const address= file.address
        console.log(address)
        assert.notEqual(address,'')
         assert.notEqual(address,null)
          assert.notEqual(address,undefined)
           assert.notEqual(address,0x0)
        
        })
        
       
    })

    describe('storage',async()=>{
        it('updates the ipfsHash',async()=>{
        let ipfsHash
        ipfsHash='123acb'
        await file.set(ipfsHash)
        const result=await file.get()
        assert.equal(result,ipfsHash)
        })
    })

})