import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class AuthInfo {
    @PrimaryColumn("varchar")
    authToken: string;

    @Column("text")
    expiryDate: string;
}
