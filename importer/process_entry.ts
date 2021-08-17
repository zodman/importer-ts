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
  async getOrCreate(table: any, whereCondition: object, data?: object){
    const objTable = await this.find(table, whereCondition)
    if (objTable === null ){
      if (data) { 
        return await this.create(table, data)
      } else {
        return await this.create(table, whereCondition)
      }
    } else {
      return objTable
    }
  }
}

interface IId{
  id: number
  name: string
}

export  class ProcessEntry extends  ProcessDB {
  private entry
  private prisma
  constructor(entry: any, prisma: PrismaClient){
    super()
    this.entry = entry
    this.prisma = prisma
  }
  async processProvince() {
    const provinceName: string = this.entry.province
    const whereCondition = {
      name: provinceName
    }
    const province =  await this.getOrCreate(this.prisma.province, whereCondition)
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
    return await this.getOrCreate(this.prisma.noc, where)
  }
  async processCompany(){
    const where = {name: this.entry.employer}
    return await this.getOrCreate(this.prisma.company, where)
  }
  async process(city: IId, noc: IId, company:IId){

    let data = {
      positions: parseInt(this.entry.positions_approved),
      noc_id: noc.id,
      company_id: company.id,
      city_id: city.id,
      year: parseInt(this.entry.year),
      phase: this.entry.phase,
      company_address: this.entry.address,
      company_zipcode: this.entry.zipcode
    }
    let where = {identify:data}
    return await this.getOrCreate(this.prisma.entry, where,data)

  }
  async execute() {
    const province = await this.processProvince()
    const city = await this.processCity(province)
    const noc = await this.processNoc()
    const company = await this.processCompany()
    const entry = await this.process(city, noc, company)
  }
}

