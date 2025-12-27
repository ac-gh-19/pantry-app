exports.ok = (res, data, status = 200) => {
  return res.status(status).json({ ok: true, data, error: null });
};

exports.fail = (res, code, message, status = 400, details = null) => {
  return res.status(status).json({
    ok: false,
    data: null,
    error: { code, message, details },
  });
};
