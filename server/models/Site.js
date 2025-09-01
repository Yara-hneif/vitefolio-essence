import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Site = sequelize.define("Site", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: "My New Portfolio",
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  template: {
    type: DataTypes.STRING,
    defaultValue: "default", // demo template
  },
  data: {
    type: DataTypes.JSONB, 
    defaultValue: {},
  },
}, {
  timestamps: true,
});

export default Site;
