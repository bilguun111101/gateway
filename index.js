const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const db = new DynamoDB();

module.exports.handler = async (event) => {
  const {
    id,
    book,
    username,
    university
  } = JSON.parse(event.body);
    const student = marshall(
      {
        id,
        book,
        username,
        university
      }
    )
    const params = {
      TableName: 'gateway',
      Item: student,
    }
    const response = await db.putItem(params);
    return response;
};


// GET METHOD
module.exports.send = async (event) => {
    const { id, username } = JSON.parse(event.body);
    const response = await db.query({
      TableName: 'gateway',
      KeyConditionExpression: 'id = :id AND username = :username',
      ExpressionAttributeValues: {
          ':id': {
              "S": id
          },
          ':username': {
              "S": username,
          }
      }
  });

  return JSON.stringify(unmarshall(response.Items));
}
