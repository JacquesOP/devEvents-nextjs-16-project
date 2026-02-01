'use server';
import Event from "@/database/event.model";
import connectDB from "../mongodb";
import { notFound } from "next/navigation";

export const getSimilarEventsBySlug = async (slug: string) => {

   try {
      await connectDB();

      const event = await Event.findOne({ slug }).lean();

      if(!event) return notFound();

      return await Event.find({ _id: { $ne: event._id}, tags: { $in: event.tags} }).lean();
      
   } catch {

      return [];
   }
}