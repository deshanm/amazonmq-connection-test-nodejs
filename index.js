var stompit = require('stompit');
 
var connectOptions = {
  'host': process.env.URL || 'localhost',
  'port': process.env.Q_PORT || 61614,
  'connectHeaders':{
    'host': '/',
    'login': process.env.Q_USER || 'admin',
    'passcode': process.env.Q_PASS || 'admin',
    'heart-beat': '5000,5000'
  }
};
 console.log('connectOptions' ,connectOptions)
stompit.connect(connectOptions, function(error, client) {
  
  if (error) {
    console.log('connect error ' + error.message);
    return;
  }
  console.log('yes connected....');

  
  var sendHeaders = {
    'destination': '/queue/test',
    'content-type': 'text/plain'
  };
  
  var frame = client.send(sendHeaders);
  frame.write('hello');
  frame.end();
  
  var subscribeHeaders = {
    'destination': '/queue/test',
    'ack': 'client-individual'
  };
  
  client.subscribe(subscribeHeaders, function(error, message) {
    
    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }
    
    message.readString('utf-8', function(error, body) {
      
      if (error) {
        console.log('read message error ' + error.message);
        return;
      }
      
      console.log('received message: ' + body);
      
      client.ack(message);
      
      client.disconnect();
    });
  });
});
 