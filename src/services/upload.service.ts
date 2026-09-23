
import { ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { storage } from "@/config/appwrite";
import { config } from "@/config/env";

export const uploadImages = async (files: Express.Multer.File[]) => {
    const uploads = files.map( async (file) => {
        const inputFile = InputFile.fromBuffer(file.buffer, file.originalname);

        const uploaded = await storage.createFile(
            config.appwriteBucketId,
            ID.unique(),
            inputFile,
            [Permission.read(Role.any())]
        );

        return `${config.appwriteEndpoint}/storage/buckets/${config.appwriteBucketId}/files/${uploaded.$id}/view?project=${config.appwriteProjectId}`;
    });

    return Promise.all(uploads)
}