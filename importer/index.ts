import { PrismaClient } from '@prisma/client'
import   ReaderCSV    from './reader'
import  Processor  from './process'
import { Logger } from 'tslog'

const log : Logger = new Logger()


const prisma = new PrismaClient()


async function main() {
    const filepath:string = "all.csv"
    let rd = new ReaderCSV(filepath)
    let proc = new Processor(rd, prisma)
    let results =  await proc.main()
    log.info(`processing ${results.length} entries.`);
}


main().then()
    .catch(e=>{
        throw e
    })
    .finally(async ()=>{
        await prisma.$disconnect()
    })
