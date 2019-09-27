const getTypeFromName = (config, typeName) => {
  const types = config ? config.types || [] : [];

  return types.find((type) => type.type === typeName) || null;
};

export default getTypeFromName;
