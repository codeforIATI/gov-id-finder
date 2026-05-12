import { defineStore } from 'pinia'
// @ts-expect-error no types available for csv-to-js-parser
import csvParser from 'csv-to-js-parser'
const csvToObj: (csv: string) => Record<string, string>[] = csvParser.csvToObj

interface Country {
  code: string
  name: string
  source: string
  year: string
}

export const useCountriesStore = defineStore('countries', {
  state: () => ({
    countries: [] as Country[],
    countriesObj: {} as Record<string, Country>,
    allCountriesObj: {} as Record<string, string>,
  }),
  actions: {
    setAllCountries(data: { code: string; name: string }[]) {
      this.allCountriesObj = data.reduce(
        (acc, item) => { acc[item.code] = item.name; return acc },
        {} as Record<string, string>
      )
    },
    setMetadata(data: string) {
      this.countries = csvToObj(data)
        .map((item: Record<string, string>) => ({
          code: item.Country_code ?? '',
          name: this.allCountriesObj[item.Country_code ?? ''] ?? '',
          source: item.Source ?? '',
          year: item.Year ?? '',
        }))
        .sort((a: Country, b: Country) => (a.name > b.name ? 1 : -1))
      this.countriesObj = this.countries.reduce((acc, item) => {
        acc[item.code] = item
        return acc
      }, {} as Record<string, Country>)
    },
  },
})
