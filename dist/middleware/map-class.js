import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
export function mapClass(cls) {
    return async (req, res, next) => {
        // Map to class
        let obj = plainToInstance(cls, req.body);
        // Validate class
        let errors = await validate(obj, {
            skipMissingProperties: true,
            whitelist: true,
            forbidNonWhitelisted: false,
            forbidUnknownValues: true,
        });
        if (errors.length > 0) {
            res.status(400).send({ error: true, errors: formatValidationErrors(errors) });
            return;
        }
        // Set validated class to locals
        res.locals.input = obj;
        next();
    };
}
function formatValidationErrors(errors) {
    return errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
        children: error.children?.length > 0 ? formatValidationErrors(error.children) : undefined,
    }));
}
//# sourceMappingURL=map-class.js.map