exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    console.log(event.arguments.input);

    return {
        id: event.arguments.input.id,
        name: event.arguments.input.name,
        bedrooms: event.arguments.input.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
};
