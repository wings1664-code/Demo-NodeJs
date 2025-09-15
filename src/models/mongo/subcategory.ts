import mongoose, { Schema } from 'mongoose';

const subcategorySchema = new Schema({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
});

export default mongoose.model('Subcategory', subcategorySchema);