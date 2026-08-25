export default defineEventHandler(async event =>{
    const requestBody = await readBody(event)
    console.log(requestBody);
})