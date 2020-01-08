import * as Hapi from "@hapi/hapi"
import * as Inert from "@hapi/inert"
import * as Vision from "@hapi/vision"
import * as HapiSwagger from "hapi-swagger"
import * as Joi from "@hapi/joi"


console.log(`Running environment ${process.env.NODE_ENV || "dev"}`);

// Catch unhandling unexpected exceptions
process.on("uncaughtException", (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on("unhandledRejection", (reason: any) => {
  console.error(`unhandledRejection ${reason}`);
});


const plugins = [
    {
        plugin: Inert
    },
    {
        plugin: Vision
    },
    {
        plugin: HapiSwagger,
        options: {
            info: {
                title: 'Test API Documentation',
                version: '1.0.0',
            },
        }
    },
]

const routes = [
    {
        method: 'GET',
        path: '/todo/{id}',
        options: {
            handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                return { sid: 1213 }
            },
            description: 'Get todo',
            notes: 'Returns a todo item by the id passed in the path',
            tags: ['api'],

            // This two use for validation in request, response and creating swagger too.
            validate: {
                params: Joi.object({
                    id : Joi.number()
                            .required()
                            .description('the id for the todo item'),
                })
            },
            response: {
                schema: Joi.object({
                    sid : Joi.number()
                        .required()
                        .description('the id for the todo item'),
                }),
            },
        },
    },
]

const init = async () => {

    const server = new Hapi.Server({
        port: 3000,
        host: 'localhost',
        debug: { request: ['error'] },
    })

    // server.
    await server.register(plugins)


    server.route(routes)

    await server.start()

}

init();
