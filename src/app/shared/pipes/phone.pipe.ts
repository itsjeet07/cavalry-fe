import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  transform(tel:any, args) {
    if (tel) {
      const value = tel
        .toString()
        .trim()
        .replace(/^\+/, "")
        .replace("(", "")
        .replace("-", "")
        .replace("+", "")
        .replace(")", "")
        .replace(/\s/g, "");

      if (value.match(/[^0-9]/)) {
        return tel;
      }

      let country, city, number;

      switch (value.length) {
        case 7:
        case 8:
        case 9:
        case 10:
          country = value.slice(0, 3);
          city = value.slice(3, 6);
          number = value.slice(6);
          break;
        case 11:
        case 12:
          country = value[0];
          city = value.slice(1, 4);
          number = value.slice(4);
          break;

        case 3: // +CCCPP####### -> CCC (PP) ###-####
          country = value;
          city = "";
          number = "";
          break;

        case 4:
        case 5:
        case 6:
          country = value.slice(0, 3);
          city = value.slice(3, 6);
          number = "";
          break;

        default:
          return tel;
      }
      console.log(number.length);
      if (city && number && number.length > 4) {
        number = number.slice(0, 3) + "-" + number.slice(3);
        return (country + " (" + city + ") " + number).trim();
      } else if (city && number && number.length <= 4) {
        return "" + country + "-" + city + "-" + number;
      } else if (country && city && !number) {
        return "" + country + "-" + city;
      } else if (country && !city && !number) {
        return "" + country + "-";
      }
    }
    return "";
  }
}



