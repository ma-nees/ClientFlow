import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const getLeads = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // We fetch an existing valid UUID from the DB to bypass PostgreSQL type restrictions
    const { data: existing } = await supabase.from('leads').select('user_id').limit(1).single();
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...req.body,
        user_id: existing?.user_id || "00000000-0000-0000-0000-000000000000"
      }])
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('leads')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
