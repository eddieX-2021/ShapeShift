function calculateNavyMethod({ gender, height, waist, hip, neck }) {
  if (!gender || !height || !waist || !neck) {
    throw new Error("Missing required inputs");
  }

  if (gender === "male") {
    const diff = waist - neck;
    if (diff <= 0) throw new Error("Invalid waist - neck difference");
    return (
      (86.010 * Math.log10(diff)) -
      (70.041 * Math.log10(height)) +
      36.76
    );
  } else if (gender === "female") {
    if (!hip) throw new Error("Hip is required for females");
    const diff = waist + hip - neck;
    if (diff <= 0) throw new Error("Invalid waist + hip - neck difference");
    return (
      (163.205 * Math.log10(diff)) -
      (97.684 * Math.log10(height)) -
      78.387
    );
  } else {
    throw new Error("Invalid gender");
  }
}

module.exports = calculateNavyMethod;
