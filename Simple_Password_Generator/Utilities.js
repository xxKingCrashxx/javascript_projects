const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = LOWER.toUpperCase();
const NUM = '0123456789';
const SPECIAL = "!@#$%&_=+?/\\";
const NOTALLOWED = ['vw', 'wv', '1l', 'l1', 'mn', "nm", "0O", 'O0', 'Q0', 'QO', 'OQ', '5S', 'S5'];

/**
 * Utilities Object which contains a bunch of utility methods.
 */
export const PasswordGenerator = {
  /**
   * utility method that allows for a configurable generated password
   * @async
   * @params properties - password properties object which contains the configurable settings for the password generation
   *  @prop length - length of password
   *  @prop includeLower - boolean - false by default
   *  @prop includeUpper - boolean - false by default
   *  @prop includeNumber - boolean - false by default
   *  @prop includeSpecial - boolean - false by default
   * @returns the Generated Password as a string
   */
  async gen_password(properties){
    return new Promise((resolve, reject) =>{
    
      if(!properties){
        properties = {
          length: 16
        }
      }
      //whatever property that isnt included is assumed true by default.
      set_default_properties(properties)

      if(!properties.length)
        reject(new Error("missing length property"));
    
      if(properties.length < 8)
        reject(new Error('password length must be atleast 8 characters long.'));

      if(!(properties.includeUpper || properties.includeLower || properties.includeNumber || properties.includeSpecial))
        reject(new Error("password generation properties must contain atleast one property"));
    
      let validChars = get_valid_chars(properties);
      let generatedPassword = '';
  
      //guarantees the properties chosen are present in the generated password
      if(properties.includeLower)
        generatedPassword += get_random_char(LOWER);
      if(properties.includeUpper)
        generatedPassword += get_random_char(UPPER);
      if(properties.includeNumber)
        generatedPassword += get_random_char(NUM);
      if(properties.includeSpecial)
        generatedPassword += get_random_char(SPECIAL);
  
      let charCount = generatedPassword.length;
      let prevChar = '';
      
      while(charCount < properties.length){
        let currentChar = get_random_char(validChars);
        
        if(check_pair(prevChar, currentChar)){
          generatedPassword += currentChar;
          prevChar = currentChar;
          charCount++;
        }
      }
      resolve(generatedPassword);
    })
  }
}

export const Utils = {
  /**
   * @params sortedArray
   * an array object filled with sorted numbers from least to greatest
   * @params value - the value you are trying to find in the sorted array
   * @returns index of found value or -1 otherwise
   */
  binary_search(sortedArray, value){
    let low = 0;
    let high = sortedArray.length - 1;
  
    while(low !== high){
      let mid = Math.floor((low + high)/2);
      if(sortedArray[mid] === value)
        return mid;
      else if(sortedArray[mid] > value)
        high = mid - 1;
      else
        low = mid + 1;
    }
    return -1
  }
};

//helper methods
function get_valid_chars(properties){
  let validChars = '';
  
  if(properties.includeLower)
    validChars += LOWER;
  if(properties.includeUpper)
    validChars += UPPER;
  if(properties.includeNumber)
    validChars += NUM;
  if(properties.includeSpecial)
    validChars += SPECIAL;
    
  return validChars;
}

function get_random_char(charGroup){
  return charGroup[Math.floor(Math.random() * charGroup.length)];
}

function set_default_properties(properties){
  properties.includeLower = properties.includeLower !== false;
  properties.includeUpper = properties.includeUpper !== false;
  properties.includeSpecial = properties.includeSpecial !== false;
  properties.includeNumber = properties.includeNumber !== false;
}

function check_pair(prev, current){
  let pairCombo1 = prev + current;
  let pairCombo2 = current + prev
  
  if(NOTALLOWED.includes(pairCombo1) || NOTALLOWED.includes(pairCombo2)){
    return false;
  }
  return true;
}