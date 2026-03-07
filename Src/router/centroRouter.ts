import { centroController } from "@controller/centroController";
import { FastifyInstance } from "fastify";


export async function centrosRouter(app: FastifyInstance) {
    const controllCentros = new centroController();

    app.route({
        method:'POST',
        url: '/createCentros',
        handler: controllCentros.createCentros
    });

    // app.route({
    //     method:'PUT',
    //     url: '/updateCentros',
    //     handler: controllCentros.update
    // });

    app.route({
        method:'GET',
        url: '/findByID',
        handler: controllCentros.getCentrosById
    });

    app.route({
        method:'GET',
        url:'/findMany',
        handler: controllCentros.getCentrosMany
    });

    app.route({
        method:'DELETE',
        url:'/deleteCentros',
        handler:controllCentros.deleteCentros
    })


}