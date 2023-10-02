import {
  Platform,
  Alert,
} from 'react-native';		
import Toast from 'react-native-simple-toast';
//import { LocaleConfig } from 'react-native-calendars';
class Utility {
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
static displayNameFormat = (first_name = "", last_name = "") => {
    let concatname = last_name + " " + first_name
    return concatname
}															   
  static notifyMessage(msg) {
    if (Platform.OS === 'android') {
      Toast.show(msg, Toast.SHORT)
    } else {
      Alert.alert(msg);
    }
  }
  // static defineLocale = (lang) => {
  //   console.log("defineing language...", lang);
  //   if (lang== "fr"){
  //     LocaleConfig.locales['fr'] = {
  //       monthNames: [
  //         'Janvier',
  //         'Février',
  //         'Mars',
  //         'Avril',
  //         'Mai',
  //         'Juin',
  //         'Juillet',
  //         'Août',
  //         'Septembre',
  //         'Octobre',
  //         'Novembre',
  //         'Décembre'
  //       ],
  //       monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  //       dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  //       dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  //       today: "Aujourd'hui"
  //     };
  //     LocaleConfig.defaultLocale = 'fr';
  //   }
  //   else{
  //     LocaleConfig.locales.en = LocaleConfig.locales[''];
  //     LocaleConfig.defaultLocale = "en";
  //   }
  // };
}
export default Utility;