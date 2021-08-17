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


export  class ProcessEntry extends  ProcessDB {
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
  async processNoc() {
    const where = {
      name: this.entry.occupations
    }
    return await this.getOrCreate(this.prisma.noc, where, where)
  }
  async execute() {
    const province = await this.processProvince()
    const city = await this.processCity(province)
    const noc = await this.processNoc()
  }
}

