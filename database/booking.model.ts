import mongoose, {
  Schema,
  Model,
  InferSchemaType,
  HydratedDocument,
  Types,
} from "mongoose";

const bookingSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Event",
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        message: "Invalid email format",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for listing bookings by event (sorted by creation date)
bookingSchema.index({ eventId: 1, createdAt: -1 });

/**
 * Pre-save hook for email validation and event existence check
 */
bookingSchema.pre("save", async function () {
  // Email format validation (already handled by schema validator, but double-check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    throw new Error("Invalid email format");
  }

  // Verify event exists using $model to access the Event model
  const Event = this.$model("Event");
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error("Event does not exist");
  }
});


// Create index on eventId for faster queries
bookingSchema.index({ eventId: 1 });

// Create compound index for common queries (event bookings by date)
bookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
bookingSchema.index({ email: 1 });

// Type exports using InferSchemaType for strong typing
export type IBooking = InferSchemaType<typeof bookingSchema>;
export type BookingDocument = HydratedDocument<IBooking>;

type BookingModel = Model<IBooking>;

// Model caching to prevent hot reload errors in Next.js development
const Booking =
  (mongoose.models.Booking as BookingModel) ||
  mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
