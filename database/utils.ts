import mongoose from 'mongoose';


async function findOne(schemaName: string, query: Object) {
    try {
    const Model = mongoose.model(schemaName);
    const result = (await Model.findOne(query)) as any; 
    
    return result;
    } catch (err) {
        console.log(err);
    }
}

async function save(schemaName: string, data: Object) {
    try {
    const Model = mongoose.model(schemaName);
    const result = new Model(data)
    await result.save();
    } catch (err) {
        console.log(err);
    }
}

async function findAndUpdate(schemaName:string,query:Object,data:Object) {
    try{
    const Model = mongoose.model(schemaName);
    const result = await Model.findOneAndUpdate(query,data);

    return result;
    } catch (err) {
        console.log(err);
    }
}
async function deleteOne(schemaName: string, query: Object) {
    try {
    const Model = mongoose.model(schemaName);
    const result = await Model.deleteOne(query);
    return result;
    } catch (err) {
        console.log(err);
    }
}
async function updateOne(schemaName: string, query: Object, data: Object) {
    try {
    const Model = mongoose.model(schemaName);
    const result = await Model.updateOne(query,data);
    return result;
    } catch (err) {
        console.log(err);
    }
}
export {
    findOne,
    findAndUpdate,
    deleteOne,
    updateOne,
    save
}