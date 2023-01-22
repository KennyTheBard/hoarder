import { Connection, r } from 'rethinkdb-ts';
import { TableNames } from '../utils';


export class DataService {

   constructor(
      private readonly connection: Connection,
   ) {}

   public async exportData(): Promise<RawData> {
      const rawData: RawData = {};
      for (const table of Object.values(TableNames)) {
         const data = await r.table(table).run(this.connection);
         rawData[table] = data;
      }
      return rawData;
   }

   public async importData(rawData: RawData): Promise<void> {
      const existingTables = await r.tableList().run(this.connection);
      for (const table of Object.values(TableNames)) {
         if (!rawData[table]) {
            continue;
         }

         if (existingTables.includes(table)) {
            await r.tableDrop(table).run(this.connection);
         }
         await r.tableCreate(table).run(this.connection);

         await r.table(table).insert(rawData[table]).run(this.connection);
      }
   }
}

export type RawData = Record<string, any[]>;
