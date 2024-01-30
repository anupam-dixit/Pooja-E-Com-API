exports.TemplateMiddleware = {
    create :async (request, reply) => {
        return request.body;
    }
};