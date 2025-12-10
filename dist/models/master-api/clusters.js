var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsPositive, IsString, IsUrl, Length, ValidateNested, } from 'class-validator';
export class Callback {
}
__decorate([
    IsDefined(),
    IsUrl({ require_tld: false }),
    __metadata("design:type", String)
], Callback.prototype, "url", void 0);
__decorate([
    IsDefined(),
    IsString(),
    Length(5, 2000),
    __metadata("design:type", String)
], Callback.prototype, "token", void 0);
export class RegisterClusterRequest {
}
__decorate([
    IsDefined(),
    IsInt(),
    IsPositive(),
    __metadata("design:type", Number)
], RegisterClusterRequest.prototype, "shardCount", void 0);
__decorate([
    IsDefined(),
    ValidateNested(),
    Type(() => Callback),
    __metadata("design:type", Callback)
], RegisterClusterRequest.prototype, "callback", void 0);
//# sourceMappingURL=clusters.js.map