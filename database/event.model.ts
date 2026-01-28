import mongoose, {
  Schema,
  Model,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      enum: ["online", "offline", "hybrid"],
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length >= 1,
        message: "Agenda must have at least 1 item",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length >= 1,
        message: "Tags must have at least 1 item",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook for slug generation and field normalization
 */
eventSchema.pre("save", function () {
  // Generate slug only if title is new or modified
  if (this.isModified("title") || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  }

  // Normalize date - trim whitespace (keep date ranges as-is)
  if (this.date) {
    this.date = this.date.trim();
  }

  // Normalize time - normalize spacing/formatting
  if (this.time) {
    this.time = this.time.trim().replace(/\s+/g, " ");
  }
});

// Type exports using InferSchemaType for strong typing
export type IEvent = InferSchemaType<typeof eventSchema>;
export type EventDocument = HydratedDocument<IEvent>;

type EventModel = Model<IEvent>;

// Model caching to prevent hot reload errors in Next.js development
const Event =
  (mongoose.models.Event as EventModel) ||
  mongoose.model<IEvent>("Event", eventSchema);

export default Event;
