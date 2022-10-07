import mongoose from "mongoose";

interface TicketsAttr {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attr: TicketsAttr): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
//adding custom function
ticketSchema.statics.build = (attrs: TicketsAttr)=>{
    return new Ticket(attrs)
}
//Creating model
const Ticket =  mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema)

export {Ticket}
