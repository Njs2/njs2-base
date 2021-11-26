let <class-name>Model;
const init<function-name>Model = async () => {
  try {
    if (<class-name>Model) return <class-name>Model;

    let <class-name>Structure = {
     <class-name>_id: { type: Number, required: true, unique: true },
    };

    let <class-name>Scehma = await MONGOManager.createSchema(<class-name>Structure);
    await MONGOManager.createIndex(<class-name>Scehma, { <class-name>_id: 1 }, "<function-name>");
    <class-name>Model = await MONGOManager.createModel("<class-name>", <class-name>Scehma, "<class-name>");

    return <class-name>Model;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  init<function-name>Model,
};