export enum ERole {
  MANAGER = 1,
  LEADER = 2,
  STAFF = 3,
  CUSTOMER = 4,
}

export enum EPermission {
  CREATE = "create",
  UPDATE = 'update',
  REMOVE = 'remove',
}

export enum ELang {
  EN = 'en',
  VN = 'vn',
}

export enum ESort {
  NEWEST = 1,
  OLDEST = 2,
  PRICE_GO_UP = 3,
  PRICE_GO_DOWN = 4,
}

export enum ERecordStatus {
  DRAFT = 1,
  ACTIVE = 2,
  ALL = 3,
}
