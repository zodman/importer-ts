import  Reader   from './reader'
import {PrismaClient} from '@prisma/client'
import  _ from 'lodash'
import { Logger } from 'tslog'

const log : Logger = new Logger()

class ProcessDB {
  async find(table: any, whereCondition: object){
    try {
      return await table.findUnique({ where : whereCondition })
    } catch (e) {
      log.error(e)
    }
  }
  async create(table: any, data: object){
    try {
      return await table.create({ data: data})
    } catch (e ) {
      log.error("Error in create", e, data)
    }
  }
  async getOrCreate(table: any, whereCondition: object, data: object){
    const objTable = await this.find(table, whereCondition)
    if (objTable === null ){
      return await this.create(table, data)
    } else {
      return objTable
    }
  }
}


class ProcessEntry extends  ProcessDB {
  private entry
  private prisma
  constructor(entry: any, prisma: PrismaClient){
    super()
    this.prisma = prisma
    this.entry = entry
  }
  async processProvince() {
    const provinceName: string = this.entry.province
    const whereCondition = {
      name: provinceName
    }
    const province =  await this.getOrCreate(this.prisma.province, whereCondition, whereCondition)
    return province
  }
  async processCity(province: {id: number}) {
    const whereCondition = {
      'name': this.entry.city
    }
    const data = Object.assign({}, whereCondition, {
      'province_id': province.id
    })
    return await this.getOrCreate(this.prisma.city, whereCondition, data)
  }

  async execute() {
    const province = await this.processProvince()
    const city = await this.processCity(province)
  }
}

class Processor {
  private reader: Reader
  private prismaClient: PrismaClient

  constructor(reader: Reader, prismaClient: PrismaClient) {
    this.reader = reader
    this.prismaClient = prismaClient
  }

  async main(){
    // SMALL ETL
    let results: any[] = await this.reader.open()
    results =  results.filter(this.preProcess)
    results = results.map(this.transform)
    const prisma = this.prismaClient
    let e: any
    for await (const entry of results) {
      e = new ProcessEntry(entry, prisma)
      await e.execute()
    }
    return results
  }

  transform(entry: any ) {
    entry.city = _.capitalize(entry.city)
    if(entry.city === "") {
      entry.city = _.split(entry.address, ',')[0]
    }
    entry.year = _.split(entry.phase, 'Q')[0]
    entry.province = _.capitalize(entry.province_territory)
    return entry
  }

  preProcess(entry: any): Boolean {
    // console.log(entry)
    let city = entry["city"]
    let province = entry["province_territory"]
    let address = entry["address"]
    let phase = entry["phase"]
    let year = parseInt(_.split(phase, 'Q')[0])
    if (city === "") {
      city = _.split(address, ',')[0]
    }

    if( province === ""){
      return false
    }
    if( !phase.includes('Q') ){
      return false
    }
    if (year < 2021) {
      return false
    }
    return true
  }

}

export default  Processor
