import { Column, Entity, OneToMany } from 'entitype';

import { PurchaseOrder } from './purchase-order';

@Entity('suppliers')
export class Supplier {
  
  @Column({ columnName: `id`, type: `int(11)`, nullable: false, generated: true, primaryKey: true, default: null })
  id: number;
  
  @Column({ columnName: `company`, type: `varchar(50)`, default: null, index: true })
  company?: string;
  
  @Column({ columnName: `last_name`, type: `varchar(50)`, default: null, index: true })
  lastName?: string;
  
  @Column({ columnName: `first_name`, type: `varchar(50)`, default: null, index: true })
  firstName?: string;
  
  @Column({ columnName: `email_address`, type: `varchar(50)`, default: null })
  emailAddress?: string;
  
  @Column({ columnName: `job_title`, type: `varchar(50)`, default: null })
  jobTitle?: string;
  
  @Column({ columnName: `business_phone`, type: `varchar(25)`, default: null })
  businessPhone?: string;
  
  @Column({ columnName: `home_phone`, type: `varchar(25)`, default: null })
  homePhone?: string;
  
  @Column({ columnName: `mobile_phone`, type: `varchar(25)`, default: null })
  mobilePhone?: string;
  
  @Column({ columnName: `fax_number`, type: `varchar(25)`, default: null })
  faxNumber?: string;
  
  @Column({ columnName: `address`, type: `longtext`, default: null })
  address?: any;
  
  @Column({ columnName: `city`, type: `varchar(50)`, default: null, index: true })
  city?: string;
  
  @Column({ columnName: `state_province`, type: `varchar(50)`, default: null, index: true })
  stateProvince?: string;
  
  @Column({ columnName: `zip_postal_code`, type: `varchar(15)`, default: null, index: true })
  zipPostalCode?: string;
  
  @Column({ columnName: `country_region`, type: `varchar(50)`, default: null })
  countryRegion?: string;
  
  @Column({ columnName: `web_page`, type: `longtext`, default: null })
  webPage?: any;
  
  @Column({ columnName: `notes`, type: `longtext`, default: null })
  notes?: any;
  
  @Column({ columnName: `attachments`, type: `longblob`, default: null })
  attachments?: any;
  
  @OneToMany(type => PurchaseOrder, x => x.supplierId)
  purchaseOrders: PurchaseOrder[];
}