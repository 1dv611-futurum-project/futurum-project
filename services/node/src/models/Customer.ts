/**
 * Mongoose Schema Customer Model.
 */

import { Document, Schema, Model, model} from "mongoose";
import { ICustomer } from "./interfaces/ICustomer";

const CustomerSchema: Schema = new Schema({
  email: String,
  name: String
});

export default model("Customer", CustomerSchema);
