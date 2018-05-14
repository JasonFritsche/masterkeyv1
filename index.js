
//key length object
var keyLength = {
  keyLength: "",
  getKeyLength: function(){
    const cutLengthRadios = document.getElementsByName('cutLengthRadios');
    for (let i = 0, length = cutLengthRadios.length; i < length; i++) {
        if (cutLengthRadios[i].checked) {
          return keyLength.keyLength = (cutLengthRadios[i].value);
            break;
        }
    }
  }
};

//master key object
var masterKey = {
  masterKey: {},
  getCuts: function(){
    const thisKeyLength = keyLength.getKeyLength(keyLength.keyLength);
    const thisMaxPinLength = pinRange.maxPinLength;
    const thisMinPinLength = pinRange.minPinLength;
    const MACradio = document.getElementsByName('MACRadios');
    const masterKeyCutsRadio = document.getElementsByName('MasterCutsRadios');
    if(MACradio[0].checked){
      if(masterKeyCutsRadio[0].checked){
        return masterKey.masterKey = Array.from({length: thisKeyLength}, () => Math.floor(Math.random() * (thisMaxPinLength - thisMinPinLength) + thisMinPinLength));
      }else if(masterKeyCutsRadio[1].checked){
        let customMasterCuts = parseInt(document.getElementById('customMasterCuts').value);
        console.log(customMasterCuts)
        const regexKeyLength = /^\d{5,6}$/;
        if(regexKeyLength.test(customMasterCuts) == true){
          return masterKey.masterKey = Array.from(customMasterCuts.toString()).map(Number);
        }else{
          alert("Your Master Key Cuts can only be " + `${thisKeyLength}`+ " cuts in length")
        }
      }

    } else if (MACradio[1].checked){
      let MAC = parseInt(document.getElementById('MACvalue').value);
      let MACMinPin = '';
      let MACMaxPin = '';
      let randomNumber = '';
      MACcuts = [];
      randomNumber = Math.floor(Math.random() * (thisMaxPinLength - thisMinPinLength) + thisMinPinLength);
      for(i = 0; i < keyLength.keyLength; i++){

          if((randomNumber + MAC) > 9){
              MACMaxPin = 9;
          }else {
            MACMaxPin = randomNumber + MAC;
          };

          if((randomNumber - MAC) < 0){
            MACMinPin = 0;
          }else{
            MACMinPin = randomNumber - MAC;
          };
          let pin = (Math.floor(Math.random() * (MACMaxPin - MACMinPin) + MACMinPin));
          MACcuts.push(pin)
          randomNumber = pin;
      }
      masterKey.masterKey = MACcuts;
      console.log(masterKey.masterKey)
    }
  },
}

//change key object
var changeKey = {
  changeKey: {},
  masterPins: [],
  bottomPins: [],
  quantity: function(){
    let quantity = document.getElementById('changeKeyQuantity').value;
    return quantity;
  },
  getCuts: function(){
    const thisKeyLength = keyLength.getKeyLength(keyLength.keyLength);
    let thisMaxPinLength = pinRange.maxPinLength;
    let thisMinPinLength = pinRange.minPinLength;
    const MACradio = document.getElementsByName('MACRadios');
    if(MACradio[0].checked){
      return changeKey.changeKey = Array.from({length: thisKeyLength}, () => Math.floor(Math.random() * (thisMaxPinLength - thisMinPinLength) + thisMinPinLength));
    } else if (MACradio[1].checked){
      let MAC = parseInt(document.getElementById('MACvalue').value);
      let MACMinPin = '';
      let MACMaxPin = '';
      let randomNumber = '';
      MACcuts = [];
      randomNumber = Math.floor(Math.random() * (thisMaxPinLength - thisMinPinLength) + thisMinPinLength);
      for(i = 0; i < keyLength.keyLength; i++){

          if((randomNumber + MAC) > 9){
              MACMaxPin = 9;
          }else {
            MACMaxPin = randomNumber + MAC;
          };

          if((randomNumber - MAC) < 0){
            MACMinPin = 0;
          }else{
            MACMinPin = randomNumber - MAC;
          };
          let pin = (Math.floor(Math.random() * (MACMaxPin - MACMinPin) + MACMinPin));
          MACcuts.push(pin)
          randomNumber = pin;
      }
      changeKey.changeKey = MACcuts;
      console.log(changeKey.changeKey)
    }
  },
  getBottomPins: function(){
    for( i = 0; i < keyLength.keyLength; i++){
      changeKey.bottomPins.push((Math.min(masterKey.masterKey[i], changeKey.changeKey[i])));
    }

  },
  getMasterPins: function(){
      let biggerPins = [];
      for(i = 0; i < keyLength.keyLength; i++){
        biggerPins.push(Math.max(masterKey.masterKey[i], changeKey.changeKey[i]));

      }
        for(i = 0; i < keyLength.keyLength; i++){
        changeKey.masterPins.push(biggerPins[i]-changeKey.bottomPins[i]);
      }
    }
};

// pin length/range object
var pinRange = {
  minPinLength: "",
  maxPinLength: "",
  getMinMaxPins: function(){
    const pinCount = document.getElementsByName('pinRangeRadios');
    if (pinCount[0].checked){
      pinRange.minPinLength = 0;
      pinRange.maxPinLength = 9;
      return;
    } else if
    (pinCount[1].checked){
      let minPinInput = document.getElementById('minPinInput').value;
      let maxPinInput = document.getElementById('maxPinInput').value;
      pinRange.minPinLength = minPinInput;
      pinRange.maxPinLength = maxPinInput;
      return;
    }
  }
};

let masterKeyOutput = "";
function createMasterKeyOutput(){

  masterKeyOutput += `  <div class="alert alert-success">
      <h3>Results</h3>
    </div>
    <div class="card-columns">
      <div class="card text-white bg-primary">
        <div class="card-header">
          <h3>Master Key</h3>
        </div>
        <ul class="list-group list-group-flush ">
          <li class="list-group-item text-white bg-primary"><strong>Cuts: </strong>${masterKey.masterKey}</li>
        </ul>
      </div>
    </div>`;
    document.getElementById('results').innerHTML = masterKeyOutput;
  };

function createChangeKeyOutput(){
   let changeKeyOutput = '';
  for(let i = 0; i < changeKey.quantity(); i++){

    changeKey.getCuts();
    changeKey.getBottomPins();
    changeKey.getMasterPins();
      changeKeyOutput +=
          `
          <div class="card text-white bg-secondary">
              <div class="card-header">
                <h3>Change Key</h3>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item text-white bg-secondary"><strong>Cuts: </strong>${changeKey.changeKey}</li>
                <li class="list-group-item text-white bg-secondary"><strong>Bottom Pin: </strong>${changeKey.bottomPins}</li>
                <li class="list-group-item text-white bg-secondary"><strong>Master Pin: </strong>${changeKey.masterPins}</li>
              </ul>
            </div>`;
            document.getElementById('results2').innerHTML = changeKeyOutput;
            changeKey.bottomPins = [];
            changeKey.masterPins = [];
  }
};

//create results, display on page
function createResults(){
  keyLength.getKeyLength();
  pinRange.getMinMaxPins();
  masterKey.getCuts();
  createMasterKeyOutput();
  createChangeKeyOutput();
  document.getElementById("resultsButton").disabled = true;
  }

function resetResults(){
  document.getElementById('results').innerHTML = "";
  document.getElementById('results2').innerHTML = "";
  document.getElementById("resultsButton").disabled = false;
}
document.getElementById('resultsButton').onclick = createResults;
document.getElementById('resetButton').onclick = resetResults;
