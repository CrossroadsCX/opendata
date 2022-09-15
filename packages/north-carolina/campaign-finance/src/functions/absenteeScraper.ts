import { parse } from 'csv-parse/sync'
import axios from 'axios'

const absenteeLink = 'https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/2022_11_08/absentee_20221108.csv'

type AbsenteeRecord = {
  county_desc: string
  voter_reg_num: string
  ncid: string
  voter_last_name: string
  voter_first_name: string
  voter_middle_name: string
  race: string
  ethnicity: string
  gender: string
  age: string
  voter_street_address: string
  voter_city: string
  voter_state: string
  voter_zip: string
  ballot_mail_street_address: string
  ballot_mail_city: string
  ballot_mail_state: string
  ballot_mail_zip: string
  other_mail_addr1: string
  other_mail_addr2: string
  other_city_state_zip: string
  relative_request_name: string
  relative_request_address: string
  relative_request_city: string
  relative_request_state: string
  relative_request_zip: string
  election_dt: string
  voter_party_code: string
  precinct_desc: string
  cong_dist_desc: string
  nc_house_desc: string
  nc_senate_desc: string
  ballot_req_delivery_type: string
  ballot_req_type: string
  ballot_request_party: string
  ballot_req_dt: string
  ballot_send_dt: string
  ballot_rtn_dt: string
  ballot_rtn_status: string
  site_name: string
  sdr: string
  mail_veri_status: string
}

export const absenteeScraper = async () => {
  const csvFile = await axios.get(absenteeLink)
  const records: AbsenteeRecord[] = parse(csvFile.data, {
    columns: true,
    skip_empty_lines: true,
  })

  return records
}
