/*
    # Lambda to create sale bill pdf and send sms to customer
    # Invokes by lambda function `CloudWatchEventLambdaTrigger` BILLGENERATED event

    2020-09-28T12:04:09.829Z    b2bbb181-316d-469c-a87c-b5f31b6c9b2e    
    ERROR   stderr: Fontconfig warning: no <cachedir> elements found. Check configuration.
    Fontconfig warning: adding <cachedir>/var/cache/fontconfig</cachedir>
    Fontconfig warning: adding <cachedir prefix="xdg">fontconfig</cachedir>


*/
const AWS = require('aws-sdk');
const fs = require('fs');
//const spawn = require( 'child_process' ).spawn;
const { exec } = require('child_process');
const request = require('sync-request');
const s3 = new AWS.S3();
const os = require('os');
const lambda = new AWS.Lambda();

AWS.config.update({region: "ap-south-1"});
process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;
process.env['FONTCONFIG_PATH'] =  process.env.LAMBDA_TASK_ROOT ; // 'var/task' ;
process.env['FONTCONFIG_FILE'] =  process.env.LAMBDA_TASK_ROOT + '/fonts.conf' ; // '/var/task/fonts.conf' ;

const wkhtmltopdf = process.env.LAMBDA_TASK_ROOT + '/wkhtmltopdf' ;
const S3BucketName = 'chandu-test-mumbai-bucket';

exports.handler = function handler(event, context, callback) {

    context.callbackWaitsForEmptyEventLoop = false;

    var phrBillUrl  = 'https://zerodha.com' ; //'https://plutohr.com/pos_reports/viewSaleBill/866850/c82bec';
    var billShortCode = 'ABC123'; // event.bill_short_code;
    var customerMobile = '9618582582' ; // event.customer_mobile;
    var messageToMobile = 'Some Very Important message from AWS'; // event.message_mobile;
    var messageSenderID = 'KALAMN';

    const S3FileName = `chandu20200928.pdf`;
    const outputFile = `/tmp/${S3FileName}`;

    // // console.log( process.env );
    // console.log( os.version() );
    // console.log( os.release() );
    // console.log( os.platform() );


const ls = exec( wkhtmltopdf + ' -d 300 -T 0mm -B 0mm --page-width 88mm --page-height 30cm ' + phrBillUrl + ' ' + outputFile , function (error, stdout, stderr) {
  if (error) {
    console.log(error.stack);
    console.log('Error code: '+error.code);
    console.log('Signal received: '+error.signal);
  }
  console.log('Child Process STDOUT: '+stdout);
  console.log('Child Process STDERR: '+stderr);
});

ls.on('exit', function (code) {
  console.log('Child process exited with exit code '+code);
});


    // try{
    //     var cmd = spawn('/bin/sh', [ '-c', wkhtmltopdf + ' -d 300 -T 0mm -B 0mm --page-width 88mm --page-height 30cm ' + phrBillUrl + ' ' + outputFile ]);

    //     cmd.stdout.on('data', (data) => {
    //       console.log(`stdout: ${data}`);
    //     });

    //     cmd.stderr.on('data', (data) => {
    //       console.error(`stderr: ${data}`);
    //     });

    //     cmd.on('error', (error) => {
    //         console.log(`FinalError: ${error.message}`);
    //     });

    //     cmd.on( 'close', function(code) {

    //         console.log(" wkhtmltopdf is supposed to be executed ");

    //         fs.readFile(outputFile, function(err, opdata){
    //             if(err){
    //                 console.log("PDF file NOT created :( ");
    //                 console.log(err);
    //                 context.done(null, 'FAILURE');
    //             }else{

    //                 var params = {
    //                     Bucket : S3BucketName,
    //                     Key : S3FileName,
    //                     Body : opdata ,
    //                     StorageClass : 'STANDARD',
    //                     ACL  :'public-read',
    //                 };

    //                 s3.putObject(params, function(err, data){
    //                     if (err) {
    //                         console.log("There was an error while saving the PDF to S3", err);
    //                         var error = new Error("There was an error while saving the PDF to S3");
    //                         callback(error);
    //                     } else {
    //                         console.log('Created PDF and uploaded to S3');
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // }catch(err){
    //     console.log("Try Catch Matched" + err.message );
    // }

};

