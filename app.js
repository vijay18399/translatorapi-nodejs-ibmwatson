var express  = require('express');  
var cors = require('cors');     
var app  = express();  
app.use(cors());               
var bodyParser = require('body-parser');
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: 'Your api key',
  }),
  url: 'https://gateway-lon.watsonplatform.net/language-translator/api',
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        

var router = express.Router();             
router.post('/translate', function(req, res) {
 
    const identifyParams = {
        text: req.body.msg
      };
      
    languageTranslator.identify(identifyParams)
      .then(identifiedLanguages => {    
    const translateParams = {
      text: identifyParams.text,
      modelId: identifiedLanguages.result.languages[0].language+'-en',
    };
    
    languageTranslator.translate(translateParams)
      .then(translationResult => {

        res.json( {
          "translation" : translationResult.result.translations[0].translation ,
          "error" : false
        }
        );   
       
      })
      .catch(err => {
        res.json({error :true});   
      });
    
    })
    .catch(err => {
      res.json({error :true});   
    });
    

});


app.use('/api', router);


app.listen(port);
console.log('Translator Working  at http://localhost:'+port);
